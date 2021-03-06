import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './Cover.css';
import { FIELD_TYPE, COVER_SECTION, TOP_TRIM_PERCENT_HEIGHT, LEFT_TRIM_PERCENT_WIDTH, COVER_TYPE, trimSizes, bookFormats } from './../../../constants/Constants'
import ImageField   from './../../../components/bookDesign/imageField/ImageField';
import TextField from './../../../components/bookDesign/textField/TextField';
import MiniImageField from './../../../containers/bookDesginPage/managePages/miniImageField/MiniImageField';
import MiniTextField from './../../../containers/bookDesginPage/managePages/miniTextField/MiniTextField';
import ChangeStylePage from './../../../components/bookDesign/page/changeLayout/ChangeStylePage';
import {
    updateImageIntoCover,
    updateTextIntoCover,
    removePhotoInCover
} from './../../../actions/projectActions/bookActions/CoversActions';
import { toggleShowUnsupportCharactersPopup } from './../../../actions/appStatusActions/RootStatusActions';
import LocaleUtils from './../../../utils/LocaleUtils';
import Tooltip  from 'rc-tooltip';
import Assets from './../../../assets/Assets'

class Cover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowSelectLayout: false
        }
        this.state = {
            position: {
                x: 0,
                y: 0
            }
        }
        this.setPositionState = this.setPositionState.bind(this);
    }

    setPositionState(e) {
        let rect = e.target.getBoundingClientRect();
        let xPos = e.pageX - rect.left - rect.width; //x position within the element
        let yPos = e.pageY - rect.top - rect.height;  //y position within the element
        this.setState({
            position: {
                x: xPos,
                y: yPos
            }
        })
    }

    onChangeImageField(imageObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateImageObject(imageObject, idLayout, idPage, idPageLayout);
    }

    onRemovePhotoInPage(idLayout, idPage, idPageLayout) {
        this.props.handleRemovePhotoInCover(idLayout, idPage, idPageLayout);
    }

    onChangeTextField(textObject, idLayout, idPage, idPageLayout) {
        this.props.onUpdateTextObject(textObject, idLayout, idPage, idPageLayout);
    }

    renderlayout(layouts, numScaleLeftCover, numScaleTopCover) {
        let { photoList, unScaleNumber } = this.props;
        var layoutArray = [];

        for (let index in layouts) {
            let idLayout = layouts[index].id;
            let idPage = layouts[index].idPage;
            let idPageLayout = layouts[index].page_layout_id;

            if (layouts[index].type === FIELD_TYPE.IMAGE) {
                let imageSource = {};
                if (layouts[index].image) {
                    if (layouts[index].image.hasOwnProperty('src')) {
                        imageSource.imageUrl = layouts[index].image.src;
                    } else {
                        imageSource.imageUrl = layouts[index].image.imageUrl;
                    }

                    if (layouts[index].image.hasOwnProperty('rotation')) {
                        imageSource.rotation = layouts[index].image.rotation;
                    } else {
                        imageSource.rotation = 0;
                    }

                    if (layouts[index].image.hasOwnProperty('zoom_level')) {
                        imageSource.zoom_level = parseFloat(layouts[index].image.zoom_level);
                    } else {
                        imageSource.zoom_level = 100;
                    }

                    imageSource.fit_policy = layouts[index].image.fit_policy;

                    if (layouts[index].image.hasOwnProperty('x_shift') && layouts[index].image.hasOwnProperty('y_shift')) {
                        imageSource.x_shift = parseInt(layouts[index].image.x_shift, 10);
                        imageSource.y_shift = parseInt(layouts[index].image.y_shift, 10);
                    } else {
                        imageSource.x_shift = 0;
                        imageSource.y_shift = 0;
                    }

                    for (let key in photoList) {
                        if (layouts[index].image.src === photoList[key].imageUrl.replace('L','O')) {
                            imageSource.name = photoList[key].name;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <ImageField
                        unScaleNumber={unScaleNumber}    
                        themeKey={this.props.bookInfo.theme}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeImageField={this.onChangeImageField.bind(this)}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        onRemovePhotoInPage={this.onRemovePhotoInPage.bind(this)}
                    />
                )
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <TextField
                        unScaleNumber={unScaleNumber}    
                        themeKey={this.props.bookInfo.theme}    
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        onChangeTextField={this.onChangeTextField.bind(this)}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        textStyle={this.getTextStyleById(layouts[index].style_id, this.props.theme)}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                        toggleKeyBoardEvent={this.props.toggleKeyBoardEvent}
                        handleShowUnsupportedUnicodeCharacters={this.props.handleShowUnsupportedUnicodeCharacters}
                    />
                )
            }
        }
        return (layoutArray);
    }

    renderLayoutPreviewMode(layouts, numScaleLeftCover, numScaleTopCover) {
        let { photoList } = this.props;
        var layoutArray = [];

        for (let index in layouts) {
            let idLayout = layouts[index].id;
            let idPage = layouts[index].idPage;
            let idPageLayout = layouts[index].page_layout_id;

            if (layouts[index].type === FIELD_TYPE.IMAGE) {
                let imageSource = {};
                if (layouts[index].image) {
                    if (layouts[index].image.hasOwnProperty('src')) {
                        imageSource.imageUrl = layouts[index].image.src;
                    } else {
                        imageSource.imageUrl = layouts[index].image.imageUrl;
                    }

                    if (layouts[index].image.hasOwnProperty('rotation')) {
                        imageSource.rotation = layouts[index].image.rotation;
                    } else {
                        imageSource.rotation = 0;
                    }

                    if (layouts[index].image.hasOwnProperty('zoom_level')) {
                        imageSource.zoom_level = parseFloat(layouts[index].image.zoom_level);
                    } else {
                        imageSource.zoom_level = 100;
                    }

                    imageSource.fit_policy = layouts[index].image.fit_policy;

                    if (layouts[index].image.hasOwnProperty('x_shift') && layouts[index].image.hasOwnProperty('y_shift')) {
                        imageSource.x_shift = parseInt(layouts[index].image.x_shift, 10);
                        imageSource.y_shift = parseInt(layouts[index].image.y_shift, 10);
                    } else {
                        imageSource.x_shift = 0;
                        imageSource.y_shift = 0;
                    }

                    for (let key in photoList) {
                        if (layouts[index].image.src === photoList[key].imageUrl.replace('L','O')) {
                            imageSource.name = key;
                            imageSource.height = photoList[key].height;
                            imageSource.width = photoList[key].width;
                        }
                    }
                }

                layoutArray.push(
                    <MiniImageField
                        isPreview={true}
                        ratio={1}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        imageSource={layouts[index].image ? imageSource : false}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                    />
                );
            } else if (layouts[index].type === FIELD_TYPE.TEXT) {
                layoutArray.push(
                    <MiniTextField
                        isPreview={true}
                        ratio={1}
                        idPage={idPage}
                        idLayout={idLayout}
                        idPageLayout={idPageLayout}
                        textSource={layouts[index].text ? layouts[index].text : ''}
                        key={idLayout}
                        sizeHeight={layouts[index].height * numScaleTopCover}
                        sizeWidth={layouts[index].width * numScaleLeftCover}
                        positionX={layouts[index].x * numScaleLeftCover}
                        positionY={layouts[index].y * numScaleTopCover}
                    />
                );
            }
        }
        return (layoutArray);
    }

    getTextStyleById(style_id, theme) {
        let textStyleList = theme.TextStyles[0].TextStyle;
        for (let i in textStyleList) {
            if (textStyleList[i].$.id === style_id) {
                return textStyleList[i].$
            }
        }
        return {};
    }

    getBackgroundById(id, listBackground) {
        for (let i in listBackground) {
            if (listBackground[i].$.id === id) {
                return listBackground[i].$.color;
            }
        }
        return '#ffffff';
    }

	renderSafeAndShadowLeftPage() {
        return (
            <div>
                <div className="page-shadow left-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="left-safe strip" />
            </div>
        );
    }

    renderSafeAndShadowRightPage() {
        return (
            <div>
                <div className="page-shadow right-sha" />
                <div className="top-safe strip" />
                <div className="bot-safe strip" />
                <div className="right-safe strip" />
            </div>
        );
    }

    renderSpineSVG(color, height, isFront) {
        let heightNumber = height + 26;
        let heightCoverPx = heightNumber + 'px';
        let dataLeft = "M.73,0H0V32.31H.06L0,562.65s-.67,10.85,6.33,23.5C14.47,600.9,27,597.87,27,597.87L27,32.31V27.25C-.56,23.63.73,0,.73,0Z";
        let dataRight = "M26.23,0H27V32.31H26.9L27,562.65s.67,10.85-6.33,23.5C12.49,600.9,0,597.87,0,597.87L0,32.31V27.25C27.52,23.63,26.23,0,26.23,0Z";
        let dataXXX = "M0.7,0H0v32.3h0.1L0,562.7c0,0-0.7,10.8,6.3,23.5c8.1,14.8,20.7,11.7,20.7,11.7V25.1V20C-0.5,16.4,0.7,0,0.7,0z";
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                id="Layer_1" data-name="Layer 1"
                viewBox="0 0 26.98 597.87"
                height={heightCoverPx}
            >
                <defs>
                    <style>
                        {
                            `.cls-1 {
                                fill:${color}
                            }`
                        }
                    </style>
                </defs>
                <path
                    className="cls-1"
                    d={isFront ? dataLeft : dataRight} 
                />
                <div className="shadow_spine"/>
            </svg>
        );
    }

    render() {
        let {coverSection, cover, layout, theme, sizePage, arrowEvent, coverType, isPreview, bookInfo, trimSize, unScaleNumber} = this.props;
        let coverclass = 'book-cover';
        let { Backgrounds } = theme;
        let { background_id } = cover;
        let backgroundCover  = this.getBackgroundById(background_id, Backgrounds[0]['Background'])
        let numScaleLeftCover = 1; //= 1-LEFT_TRIM_PERCENT_WIDTH;
        let numScaleTopCover = 1; //= 1-TOP_TRIM_PERCENT_HEIGHT;
        let sizeCover = {
            // width: sizePage.width * numScaleLeftCover,
            // height: sizePage.height * numScaleTopCover,
            width: trimSize.size.width,
            height: trimSize.size.height
        }
        let spinClass = 'spin-on-cover';
        let aboveBookClass = 'above-book';
        let arrowButton = null;
        let isFront = coverSection === COVER_SECTION.FRONT_COVER;
        if (isFront) {
            arrowButton =    <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                                      align={{
                                          offset: [this.state.position.x, this.state.position.y],
                                      }}
                                      overlay={LocaleUtils.instance.translate('tooltip.next_page')}>
                                <div className="nav-arrow icon-wingRight" onClick={arrowEvent} onMouseEnter={this.setPositionState}>
                                <div className="inside icon-ArrowRight" /> </div>
                            </Tooltip>;
            coverclass = 'book-cover front-cover';
            spinClass = 'spin-on-cover spin-left';
            aboveBookClass = 'above-book above-book-on-front-cover';

        } else if (coverSection === COVER_SECTION.BACK_COVER) {
            arrowButton =   <Tooltip placement='bottomRight' prefixCls='rc-tooltip-custom-page'
                                        align={{
                                            offset: [this.state.position.x, this.state.position.y],
                                        }}
                                        overlay={LocaleUtils.instance.translate('tooltip.previous_page')} >
                                        <div className="nav-arrow icon-wingLeft" onClick={arrowEvent} onMouseEnter={this.setPositionState}>
                                                        <div className="inside icon-ArrowLeft" />
                                        </div>
                            </Tooltip>;
            coverclass = 'book-cover back-cover';
            spinClass = 'spin-on-cover spin-right';
            aboveBookClass = 'above-book above-book-on-back-cover';
        }

		let styleCover = 	{
								...sizeCover
							}
        let stylePaper =    {
                                ...sizeCover,
                                background: backgroundCover
                            }
        let styleSpine =    {
                                // background: backgroundCover
                            }

        const changeStyleRightSidePage = <ChangeStylePage
                                            positionOfPage='cover'
                                            display='main-page'
                                            coverSection={coverSection}
                                        />;

        let styleCoverChangeDesign = {
            zIndex: 50,
            transform: 'scale('+ unScaleNumber + ')'
        }

        let styleJacket = {
            background: backgroundCover
        }



        return (
            <div className={coverclass} style={styleCover}>
                <div className={spinClass} style={styleSpine}>{this.renderSpineSVG(backgroundCover, sizeCover.height, isFront)}</div>
                <div className="drak-sha" />
                <div className="back-drop" />
                <div className={aboveBookClass}>
                    {
                        coverType===COVER_TYPE.HARDCOVER_DUST_JACKET ? <div className="jacket" style={styleJacket}></div> : null
                    }
                    <span className="page-is-1"></span>
                    <span className="page-is-2"></span>
                    <span className="page-is-3"></span>
                    <span className="page-is-4"></span>
                    <span className="page-is-5"></span>
                    <span className="page-is-6"></span>
                    <span className="page-is-7"></span>
                    <span className="page-is-8"></span>
                </div>
                <div className="paper-book" style={stylePaper}>
                    {
                        isPreview ? this.renderLayoutPreviewMode(layout, numScaleLeftCover * numScaleLeftCover, numScaleTopCover * numScaleTopCover)
                            : this.renderlayout(layout, numScaleLeftCover * numScaleLeftCover, numScaleTopCover * numScaleTopCover)
                    }
                    <div className="change-layout-border-background right-page" style={styleCoverChangeDesign}>
                        {
                            !isPreview ? changeStyleRightSidePage : null
                        }
                    </div>
                    {
                        coverSection === COVER_SECTION.FRONT_COVER ? this.renderSafeAndShadowLeftPage()
                            : coverSection === COVER_SECTION.BACK_COVER ? this.renderSafeAndShadowRightPage() : null
                    }
                </div>
                {
                    arrowButton
                }
            </div>
        );
    }
}

Cover.propTypes = {
    coverSection: PropTypes.string,
    cover: PropTypes.object,
    layout: PropTypes.object,
    theme: PropTypes.object,
    sizePage: PropTypes.object,
    coverType: PropTypes.string,
    isPreview: PropTypes.bool,
    unScaleNumber: PropTypes.number
}

Cover.defaultProps = {
    unScaleNumber: 1
}

const handleRemovePhotoInCover = (dispatch, idLayout, idPage, idPageLayout) => {
    dispatch(removePhotoInCover({ idLayout, idPage, idPageLayout }));
}

const onUpdateImageObject = (dispatch, imageObject, idLayout, idPage, idPageLayout) => {
    let cover = { imageObject, idLayout, idPage, idPageLayout };
    dispatch(updateImageIntoCover(cover));
}

const onUpdateTextObject = (dispatch, textObject, idLayout, idPage, idPageLayout) => {
    let cover = { textObject, idLayout, idPage, idPageLayout };
    dispatch(updateTextIntoCover(cover));
}

const handleShowUnsupportedUnicodeCharacters = (dispatch) => {
    dispatch(toggleShowUnsupportCharactersPopup());
}

const mapStateToProps = (state) => {
    const { photoList, project } = state;
    const { book } = project;
    const { bookInfo } = book;
    return {photoList, bookInfo};
};

const mapDispatchToProps = (dispatch) => ({
    handleShowUnsupportedUnicodeCharacters: () => handleShowUnsupportedUnicodeCharacters(dispatch),
    onUpdateImageObject: (imageObject, idLayout, idPage, idPageLayout) => onUpdateImageObject(dispatch, imageObject, idLayout, idPage, idPageLayout),
    onUpdateTextObject: (textObject, idLayout, idPage, idPageLayout) => onUpdateTextObject(dispatch, textObject, idLayout, idPage, idPageLayout),
    handleRemovePhotoInCover: (idLayout, idPage, idPageLayout) => handleRemovePhotoInCover(dispatch, idLayout, idPage, idPageLayout)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Cover);
